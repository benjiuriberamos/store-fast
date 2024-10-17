'use strict'

let SHOW_LOADER = true;

$(document).ready(function () {
    $.ajaxSetup({
        beforeSend: function() {
            if (SHOW_LOADER) {
                loaderStart();
            }
        },
        complete: function() {
            loaderStop();
        }
    });
    // $(".tab-item").click(function(e){
    //     setTimeout(function () {
    //         $(window).trigger('resize');
    //     }, 200);
    // });
});

function loaderStart() {
    $.preloader.start({
        modal: true,
        src : 'sprites5.png'
    })
}

function loaderStop() {
    $.preloader.stop();
}

function showMessage(message, type) {
    alert(message);
    // if (type === 'success') {
    //     messageSuccess(message);
    // } else if (type === 'error') {
    //     messageError(message);
    // } else if (type === 'warning') {
    //     messageWarning(message);
    // } else {
    //     messageInfo(message);
    // }
}

function messageSuccess(message) {
    alert(message);
    // toastr.success(message);
}

function messageError(message) {
    alert(message);
    // toastr.error(message);
}

function messageWarning(message) {
    alert(message);
    // toastr.warning(message);
}

function messageInfo(message) {
    alert(message);
    // toastr.info(message);
}
