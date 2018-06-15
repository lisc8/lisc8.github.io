"use strict";

var ThingsItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.title = obj.title;
        this.author = obj.author;
        this.date = obj.date;
        this.content = obj.content;
        this.leaveMsg = obj.leaveMsg;
    } else {
        this.title = '';
        this.author = '';
        this.date = '';
        this.content = '';
        this.leaveMsg = '';
    }
};

ThingsItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};


var Things = function () {
    LocalContractStorage.defineMapProperty(this, "arrayMap");
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "allThings", {
        parse: function (text) {
            return new ThingsItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Things.prototype = {
    init: function () {
        this.size = 0;
    },
    get:function(title){
        return this.allThings.get(title);
    },
    writeThings: function (title,content,date) {
        var author = Blockchain.transaction.from;
        var thingsItem = this.allThings.get(title);
        if(thingsItem){
            throw new Error("标题已经存在");
        }
        thingsItem = new ThingsItem();
        thingsItem.title = title;
        thingsItem.author = author;
        thingsItem.content = content;
        thingsItem.date = date;
        this.allThings.put(title,thingsItem);
        this.arrayMap.put(this.size,title);
        this.size++;
    },
    leaveMessage:function(title,content,date){
        var thingsItem = this.allThings.get(title);
        var from = Blockchain.transaction.from;
        var temp = from+'|'+date+'|'+content;
        thingsItem.leaveMsg = thingsItem.leaveMsg +temp+ '_';
        this.allThings.put(title,thingsItem);
    },
    len:function(){
        return this.size;
    },
    forEach: function(limit, offset){
        limit = parseInt(limit);
        offset = parseInt(offset);
        if(offset>this.size){
            throw new Error("offset is not valid");
        }
        var number = offset+limit;
        if(number > this.size){
            number = this.size;
        }
        var result  = [];
        for(var i=offset;i<number;i++){
            var key = this.arrayMap.get(i);
            var object = this.allThings.get(key);
            result.push(object);
        }
        return JSON.stringify(result);
    }
};
module.exports = Things;