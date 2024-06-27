class Api::V1::Accounts::Contacts::ConversationsController < Api::V1::Accounts::Contacts::BaseController
  def index
    @conversations = if Current.user.administrator? || Current.user.supervisor?
                       Current.account.conversations.includes(
                         :assignee, :contact, :inbox, :taggings
                       ).where(inbox_id: inbox_ids, contact_id: @contact.id)
                              .order(id: :desc).limit(20)
                     else
                       Current.account.conversations.includes(
                         :assignee, :contact, :inbox, :taggings
                       ).where(inbox_id: inbox_ids, contact_id: @contact.id)
                              .where('(assignee_id is null or assignee_id = :assignee_id or EXISTS(select 1 from conversation_participants where account_id=conversations.account_id and user_id=:assignee_id and conversation_id=conversations.id))', assignee_id: Current.user.id)
                              .order(id: :desc).limit(20)
                     end
  end

  private

  def inbox_ids
    if Current.user.administrator? || Current.user.agent? || Current.user.supervisor?
      Current.user.assigned_inboxes.pluck(:id)
    else
      []
    end
  end
end
