/*
 显示操作组件，类似选择兴趣标签，一个文本，后面跟一个删除操作符
*/
function initViewDeleteSpan($dom, dataSet, viewField, callback) {
    $dom.html("");
    $dom.addClass("form-inline");
    for (var i = 0; i < dataSet.length; i++) {
        (function (index, item, callback) {
            $div = $("<div class='input-group' style='margin-right:20px;margin-bottom:5px;'></div>");
            $span = $("<span class='input-group-addon'>" + dataSet[index][viewField] + "</span>");
            $button = $("<button type='button' class='btn btn-default'><span class='fa fa-remove'></span></button>");
            $button.click(function (e) {
                e.preventDefault();
                // 删除元素
                $(this).parent().remove();
                callback(item);
            });
            $div.append($span);
            $div.append($button);
            $dom.append($div);
        })(i, dataSet[i], callback);
    }
}
