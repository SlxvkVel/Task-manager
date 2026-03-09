export class NotificationService {
    static async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Браузер не поддерживает уведомления');
            return false;
        }
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') return false;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    static notify(title, options = {}) {
        if (Notification.permission === 'granted') {
            return new Notification(title, options);
        }
        return null;
    }
}