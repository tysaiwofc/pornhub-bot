import paypal from 'paypal-rest-sdk'


export const products = [
    {
        sku: '1',
        name: 'Private Server Premium',
        price: '50',
        currency: 'BRL',
        quantity: 1
    }
]
export default class PayPal {
    constructor() {
        this.mode = 'sandbox';
        this.client_id = process.env.PAYPAL_CLIENT_ID;
        this.secret = process.env.PAYPAL_CLIENT_SECRET;
        this.sdk = paypal
    }

    async start() {
        return this.sdk.configure({
            mode: this.mode,
            client_id: this.client_id,
            client_secret: this.secret
        })
    }

    async buy() {
        const payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'https://discord.gg/ARfYSYX4Yw',
                cancel_url: 'https://www.youtube.com/watch?v=eHBNVKFdPCc'
            },
            transactions: [
                {
                    item_list: {
                            items: products
                    },
                    amount: {
                        currency: products[0].currency,
                        total: products[0].price
                    },
                    description: "Premium Private server"
                }
            ]
        }

        this.sdk.payment.create(payment_json, (err, payment) => {
            if(err) return err
            return payment
        })
    }
}