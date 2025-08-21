export default class Button {
    constructor(client, options) {
        this.id = options.id
        this.client = client
        this.permissions = options.permissions || ["database", "log"]
        this.only = options.only || false
        this.no_expire = options.no_expire
        this.user_permissions = options.user_permissions || []
        this.bot_permissions = options.bot_permissions || []
    }
}