class Api::V1::Accounts::Contacts::ConversationsController < Api::V1::Accounts::Contacts::BaseController
  def index
    @conversations = if Current.user.administrator?
                       Current.account.conversations.includes(
                         :assignee, :contact, :inbox, :taggings
                       ).where(inbox_id: inbox_ids, contact_id: @contact.id)
                              .order(id: :desc).limit(20)
                     else
                       Current.account.conversations.includes(
                         :assignee, :contact, :inbox, :taggings
                       ).where(inbox_id: inbox_ids, contact_id: @contact.id)
                              .where('(assignee_id is null or assignee_id = ?)', Current.user.id)
                              .order(id: :desc).limit(20)
                     end
  end

  private

  def inbox_ids
    if Current.user.administrator? || Current.user.agent?
      Current.user.assigned_inboxes.pluck(:id)
    else
      []
    end
  end
end
