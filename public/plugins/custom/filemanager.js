$(document).ready(function () {
    const tools = $('div#tools');
    const modal_new = $('div#new');

    const filemanagerDropzone = new Dropzone('form#filebrowser_dropzone', {
        url: pathUploadFile
    })

    $(document).on('click', '.open-filebrowser', function(e) {
        e.preventDefault();
        const to_return = $(this).attr('data-return');
        $('table#filemanager').attr('data-return', to_return);
        let path = $('#' + to_return).val().replace('uploads','').split('/');
        path.splice(-1,1);
        path = path.join('/');
        browse(path);
    });

    $(document).on('click', '#main-content .media .trash', function() {
        const to_return = $(this).attr('data-id');
        $('#' + to_return).attr('value', '');
        $('#t_' + to_return).find('.fancybox, .trash, .image_name').addClass('d-none');
    });

    $('div#new form').submit(function (e) {
        const new_path = $('div#new input#new-path');
        modal_new.modal('hide');
        $.ajax({
            url: pathCreateFolderFilemanager,
            data: {data: new_path.attr('data-base') + new_path.val()},
            cache: false,
            dataType: 'json',
            type: 'POST',
            success: function (result) {
                showMessage(result['msg'], result.status ? 'success' : 'error', 'PHP');
                browse(PATH);
            },
            error: function (jqXHR, status) {
                showMessage(status, 'error', 'AJAX');
            }
        });
        return false;
    });

    $('div#remove button.submit').click(function (e) {
        $.ajax({
            url: pathDeleteFilemanager,
            data: {data:$('div#remove input#remove-path').val()},
            cache: false,
            dataType: 'json',
            type: 'POST',
            success: function (result) {
                showMessage(result['msg'], result.status ? 'success' : 'error', 'PHP');
                browse(PATH);
            },
            error: function (jqXHR, status) {
                showMessage(status, 'error', 'AJAX');
            }
        });
    });

    $('div#upload').on('hidden.bs.modal', function (e) {
        filemanagerDropzone.removeAllFiles();
        browse(PATH);
        const body = $('body');
        if (!body.hasClass('modal-open')) {
            body.addClass('modal-open');
        }
    });

    // $('#upload').on('click', '.btn-danger', function(e) {
    //     e.preventDefault();
    //     $('#upload').removeClass('show');
    // });

    // $('#remove').on('click', '.btn-danger', function(e) {
    //     $('#remove').removeClass('show');
    // });

    tools.on('click', 'button#upload-button', function (e) {
        $('div#upload input#upload-path').val((PATH === '' ? '' : (PATH + '/')));
        $('div#upload').modal('show');
    });

    tools.on('click', 'button#new-folder-button', function (e) {
        // e.preventDefault();
        $('div#new input#new-type').val('folder');
        $('div#new input#new-path').attr('data-base', PATH == '' ? '' : (PATH + '/'));
        modal_new.modal('show');
    });

    tools.on('click', 'button#refresh-button', function (e) {
        browse(PATH);
    });

    modal_new.on('shown.bs.modal', function (e) {
        $('#new-path').focus();
    });

    modal_new.on('hidden.bs.modal', function (e) {
        const new_path = $('div#new input#new-path');
        new_path.val('');
        new_path.attr('data-base', '');
    });
});

function browse(path) {
    path = typeof path !== 'undefined' ? path : '';
    $.ajax({
        url: pathListFilemanager,
        data: {data:path},
        cache: false,
        dataType: 'json',
        type: 'POST',
        success: function (result) {
            if (result.status)
                show_content(path, result.files);
            else
                showMessage(result['msg'], 'error', 'PHP');
        },
        error: function (jqXHR, status) {
            showMessage(status, 'error', 'AJAX');
        },
        complete: function (){
            loaderStop();
            $('#gallerybrowser').modal('show');
        }
    });
}

function show_content(path, files) {
    PATH = path;
    set_breadcrumb();
    const filemanager = $('table#filemanager');

    filemanager.empty();

    for (let i = 0; i < files.length; i++) {
        let f = files[i];

        if (f['folder']) {
            f['icon'] = 'carpeta';
            f['name'] = $('<a />').attr('href', f['link']).text(f['name']).click(function (e) {
                e.preventDefault();
                browse($(this).attr('href'));
            });
        } else {
            const extension = f['name'].substr((f['name'] . lastIndexOf('.') + 1));
            if (f['thumb'] === 'pdf') {
                f['icon'] = $('<i class="fa fa-file-pdf-o"></i>');
            } else if (f['thumb'] === 'doc' || f['thumb'] === 'docx') {
                f['icon'] = $('<i class="fa fa-file-word-o"></i>');
            } else if (f['thumb'] === 'xls' || f['thumb'] === 'xlsx') {
                f['icon'] = $('<i class="fa fa-file-excel-o"></i>');
            } else if (f['thumb'] === 'ppt' || f['thumb'] === 'pptx') {
                f['icon'] = $('<i class="fa fa-file-powerpoint-o"></i>');
            } else if ( extension === 'gif' || extension === 'png' || extension === 'jpg' || extension === 'jpeg' ) {
                f['icon'] = $('<a class="fancybox" data-fancybox />').attr('href', asset_url + f['link']).append($('<img src="' + asset_url + f['thumb'] + '" />'));
            } else if (f['thumb'] === 'svg') {
                f['icon'] = $('<a class="fancybox" data-fancybox />').attr('href', asset_url + f['link']).append($('<img style="max-width: 50px; max-height: 50px;" src="' + asset_url + f['link'] + '" />'));
            }

            f['name'] = $('<a />').attr('href', f['link']).text(f['name']).click(function (e) {
                e.preventDefault();
                let imagen = $(this).attr('href'),
                    to_return = filemanager.attr('data-return'),
                    file = $(this).text(),
                    extension = file.substr((file.lastIndexOf('.') + 1));
                $('#' + to_return).attr('value', imagen);
                $('#t_' + to_return).find('.fancybox').attr('href', asset_url + imagen);
                $('#t_' + to_return).find('.image_name').text(imagen.substr(8));
                $('#t_' + to_return).find('.trash, .image_name').removeClass('d-none');
                if ( extension === 'gif' || extension === 'png' || extension === 'jpg' || extension === 'jpeg' ) {
                    $('#t_' + to_return).find('.fancybox').removeClass('d-none');
                }else{
                    $('#t_' + to_return).find('.fancybox').addClass('d-none');
                }
                $('#gallerybrowser').modal('hide');
            });
        }

        // remove action
        f.remove = $('<a class="btn btn-default btn-xs" />').attr('href', f['link']).html('<i class="fa fa-trash"></i>').click(function (e) {
            e.preventDefault();
            $('div#remove input#remove-path').val($(this).attr('href'));
            $('div#remove').modal('show');
        });

        filemanager.append(
            $('<tr />').append(
                $('<td class="text-center" />').append(f['icon']),
                $('<td />').append(f['name']).append((f['sizes'] === '') ? '' : '<p class="help-block">' + f['sizes'] + '</p>'),
                $('<td class="hidden-xs"/>').text(f.size),
                $('<td class="hidden-xs"/>').text(f.date),
                $('<td style="text-align:right">').append(f.remove)
            )
        );
    }
}

function set_breadcrumb() {
    // clear
    const breadcrumb = $('ol#breadcrumb');
    breadcrumb.html('<li class="breadcrumb-item"><a href="">Inicio</a></li>');

    // add parts
    const parts = PATH.split('/');
    let html = '';
    let link = '';
    for (let i = 1; i < parts.length; i++) {
        if (i !== parts.length - 1) {
            link += i === 0 ? parts[i] : '/' + parts[i];
            html += '<li class="breadcrumb-item"><a href="' + link + '">' + parts[i] + '</a></li>';
        } else {
            html += '<li class="breadcrumb-item active">' + parts[i] + '</li>';
        }
    }
    breadcrumb.append(html);

    // register click event
    $('ol#breadcrumb a').click(function (e) {
        e.preventDefault();
        browse($(e.target).attr('href'));
    });
}
