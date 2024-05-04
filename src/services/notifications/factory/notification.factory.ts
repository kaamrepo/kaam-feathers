export class NotificationFactory {

    static createFactory(type){
        switch (type) {
            case 'FCM':
                // return new FCMNotification()
            case 'EMAIL':
                // return new EMAILNotification()
            case 'SMS':
                // return new SMSNotification()
        
            default:
                break;
        }
    }
}