/**
* Other battery icon sets: 
*          
*    * http://www.iconarchive.com/show/vista-hardware-devices-icons-by-icons-land/Battery-Power-Full-icon.html
*    * http://www.softicons.com/object-icons/original-battery-icon-by-mythique-design/battery-icon
*
*/

window.addEventListener('load', function() {
    var link = document.getElementById('close');
    link.addEventListener('click', function() {
        window.close();
    });
    $('select').material_select();

    var percentage = options.percentage;
    if(localStorage.percentage !== undefined) {
        $('#percentage').val(localStorage.percentage).change();
        $('select').material_select();

    }
    percentage.onchange = function() {
        localStorage.percentage = options.percentage.value;
    };

    // Experimental
    var accountNo = options.accountNo;
    if(localStorage.accountNo !== undefined) {
        $('#accountNo').val(localStorage.accountNo).change();
        $('select').material_select();

    }
    accountNo.onchange = function() {
        localStorage.accountNo = options.accountNo.value;
    };

    // List all installed extensions
    chrome.management.getAll(function(extInfos) {
        extInfos.forEach(function(ext) {
            console.log(JSON.stringify(ext));
        });
    });
});
