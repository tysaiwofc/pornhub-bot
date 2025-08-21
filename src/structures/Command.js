export default class Command {
    constructor(client, options) {
        this.client = client
        this.type = options.type
        this.name = options.name
        this.name_localizations = options.name_localizations || {}
        this.active = options.active || true
        this.user_permissions = options.user_permissions || []
        this.bot_permissions = options.bot_permissions || []
        this.ephemeral = options.ephemeral || false
        this.description = options.description
        this.description_localizations = options.description_localizations || {}
        
        this.options = options.options
        this.default_member_permissions = options.default_member_permissions
        this.nsfw = options.nsfw ||false
        this.guildOnly = options.guildOnly ||false     
        this.dm_permission = options.dm_permission || false
        this.contexts = options.context || [0]
        this.integration_types = options.integrationTypes || [0]
        this.aliases = options.aliases || []
        this.interactionOnly = options.interactionOnly || false
    }
}