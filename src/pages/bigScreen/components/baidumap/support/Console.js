const debug = (...msg)=>{
    console.log.apply(console , ["[-DEBUG-]"].concat(msg));
};

const log = (...msg)=>{
    console.log.apply(console , ["[---LOG-]"].concat(msg));
};

const info = (...msg) =>{
    console.log.apply(console , ["[--INFO-]"].concat(msg));
};

const error = (...msg)=>{
    console.error.apply(console , ["[-ERROR-]"].concat(msg));
};

const warn = (...msg) =>{
    console.warn.apply(console,["[--WARN-]"].concat(msg));
};

const time = (label)=>{
    console.time("[--COST-] " + label);
};

const timeEnd = (label)=>{
    console.timeEnd("[--COST-] " + label);
};


export default {
    debug,
    log,
    info,
    warn,
    error,
    time,
    timeEnd
};