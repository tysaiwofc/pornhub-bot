export default class Component {
    constructor(client, options) {
        this.client = client;

        this.type = options.type;
        this.customId = options.customId || null;
        this.user_permissions = options.user_permissions || [];
        this.bot_permissions = options.bot_permissions || [];
        if (typeof options.run !== "function") {
            throw new Error(`[Component: ${this.customId}] precisa de um método "run(interaction)"`);
        }
        this.run = options.run;
    }
}
