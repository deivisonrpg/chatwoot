class CustomFilterPolicy < ApplicationPolicy
  def create?
    @account_user.administrator? || @account_user.agent? || @account_user.supervisor?
  end

  def show?
    @account_user.administrator? || @account_user.agent? || @account_user.supervisor?
  end

  def index?
    @account_user.administrator? || @account_user.agent? || @account_user.supervisor?
  end

  def update?
    @account_user.administrator? || @account_user.agent? || @account_user.supervisor?
  end

  def destroy?
    @account_user.administrator? || @account_user.agent? || @account_user.supervisor?
  end
end
