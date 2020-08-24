const IDFactory = function (prefix) {
    if(!prefix){
        prefix = "_id_";
    }

    let day = new Date();
    let year = day.getFullYear();
    let month = day.getMonth() + 1;
    let date = day.getDate();
    let hour = day.getHours();
    let minutes = day.getMinutes();
    let seconds = day.getSeconds();

    let format = ""
        // + year
        // + (month < 10 ? ("0" + month) : month)
        // + (date < 10 ? ("0" + date) : date)
        + (hour < 10 ? ("0" + hour) : hour)
        + (minutes < 10 ? ("0" + minutes) : minutes)
        + (seconds < 10 ? ("0" + seconds) : seconds)
        + "00000";

    return {
        prefix : prefix,
        idx: 0,
        stamps: parseInt(format),
        next() {
            return prefix + this.stamps + this.idx++;
        },
        index() {
            return this.idx;
        }
    };

};

const idGen = IDFactory();

export {
    IDFactory,
    idGen
};

export default idGen;
