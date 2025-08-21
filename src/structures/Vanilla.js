export default class Vanilla {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.aliases = options.aliases || []
        this.user_permissions = options.user_permissions || []
        this.bot_permissions = options.bot_permissions || []
    }
}