export const formatTime = (timer: number) => {
    const date = new Date(0);
    date.setSeconds(timer);
    return date.toISOString().substr(11, 8);
}
