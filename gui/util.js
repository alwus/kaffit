export default function correctTimestamp(timestamp) {
    let year = timestamp.substring(0,4);
    let month = timestamp.substring(5,7);
    let day = timestamp.substring(8,10);
    return `${day}.${month}.${year}`;
}