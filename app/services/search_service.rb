class SearchService
  pattr_initialize [:current_user!, :current_account!, :params!, :search_type!]

  def perform
    case search_type
    when 'Message'
      { messages: filter_messages }
    when 'Conversation'
      { conversations: filter_conversations }
    when 'Contact'
      { contacts: filter_contacts }
    else
      { contacts: filter_contacts, messages: filter_messages, conversations: filter_conversations }
    end
  end

  private

  def accessable_inbox_ids
    @accessable_inbox_ids ||= @current_user.assigned_inboxes.pluck(:id)
  end

  def search_query
    @search_query ||= params[:q].to_s.strip
  end

  def filter_conversations
    if @current_user.administrator? || @current_user.supervisor?
      @conversations = current_account.conversations.where(inbox_id: accessable_inbox_ids)
                                      .joins('INNER JOIN contacts ON conversations.contact_id = contacts.id')
                                      .where("cast(conversations.display_id as text) ILIKE :search OR contacts.name ILIKE :search OR contacts.email
ILIKE :search OR contacts.phone_number ILIKE :search OR contacts.identifier ILIKE :search", search: "%#{search_query}%")
                                      .order('conversations.created_at DESC')
                                      .limit(10)
    else
      # ActiveRecord::Base.logger = Logger.new(STDOUT)

      @conversations = current_account.conversations.where(inbox_id: accessable_inbox_ids)
                                      .joins('INNER JOIN contacts ON conversations.contact_id = contacts.id')
                                      .where("(cast(conversations.display_id as text) ILIKE :search OR contacts.name ILIKE :search OR contacts.email
ILIKE :search OR contacts.phone_number ILIKE :search OR contacts.identifier ILIKE :search) and (conversations.assignee_id is null or conversations.assignee_id = :user_id or (conversations.assignee_id is not null and EXISTS (select 1 from conversation_participants where conversation_participants.user_id = :user_id and conversation_participants.account_id = conversations.account_id and conversation_participants.conversation_id = conversations.id)))", search: "%#{search_query}%", user_id: @current_user.id)
                                      .order('conversations.created_at DESC')
                                      .limit(10)
      # ActiveRecord::Base.logger = nil
    end
  end

  def filter_messages
    if @current_user.administrator? || @current_user.supervisor?
      @messages = current_account.messages.where(inbox_id: accessable_inbox_ids)
                                 .where('messages.content ILIKE :search', search: "%#{search_query}%")
                                 .where('created_at >= ?', 3.months.ago)
                                 .reorder('created_at DESC')
                                 .limit(10)
    else
      @messages = current_account.messages.where(inbox_id: accessable_inbox_ids)
                                 .joins('inner join conversations on (conversations.id = messages.conversation_id and conversations.account_id = messages.account_id and conversations.inbox_id = messages.inbox_id)')
                                 .where('messages.content ILIKE :search and (conversations.assignee_id is null or conversations.assignee_id = :user_id or (conversations.assignee_id is not null and EXISTS (select 1 from conversation_participants where conversation_participants.user_id = :user_id and conversation_participants.account_id = messages.account_id and conversation_participants.conversation_id = messages.conversation_id)))', search: "%#{search_query}%", user_id: @current_user.id)
                                 .where('messages.created_at >= ?', 3.months.ago)
                                 .reorder('messages.created_at DESC')
                                 .limit(10)
    end
  end

  def filter_contacts
    @contacts = current_account.contacts.where(
      "name ILIKE :search OR email ILIKE :search OR phone_number
      ILIKE :search OR identifier ILIKE :search", search: "%#{search_query}%"
    ).resolved_contacts.order_on_last_activity_at('desc').limit(10)
  end
end
