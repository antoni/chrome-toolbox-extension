/**
* Other battery icon sets: 
*          
*    * http://www.iconarchive.com/show/vista-hardware-devices-icons-by-icons-land/Battery-Power-Full-icon.html
*    * http://www.softicons.com/object-icons/original-battery-icon-by-mythique-design/battery-icon
*
*/

function saveJiraOptions(pid, issueType, priority, baseURL, ticketPrefix) {
    jiraOptions = {};
    // Base URL
    jiraOptions.baseURL = baseURL;
    // Ticket prefix
    jiraOptions.ticketPrefix = ticketPrefix;

    // Project Id
    jiraOptions.pid = pid;
    // Issue type
    jiraOptions.issueType = issueType;
    // Priority
    jiraOptions.priority = priority;
    localStorage.jiraOptions = JSON.stringify(jiraOptions);
}

function initDefaultJiraOptions() {
    saveJiraOptions(16700, 1, 3, '', '')
}

window.addEventListener('load', function() {
    var close1 = document.getElementById('close');
    var close2 = document.getElementById('jira-save');
    close1.addEventListener('click', function() {
        window.close();
    });
    close2.addEventListener('click', function() {
        saveCurrentJiraOptions();
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

    // JIRA

    if (localStorage.jiraOptions === undefined) {
        initDefaultJiraOptions();
    }

    var jiraOpts = JSON.parse(localStorage.jiraOptions);

    var baseURL = jira_options.jira_base_url;
    var projectId = jira_options.jira_project_id;
    var ticketPriority = jira_options.jira_ticket_priority;
    var ticketPrefix = jira_options.jira_ticket_prefix;

    projectId.value = jiraOpts.pid;
    ticketPriority.value = jiraOpts.priority;
    $('select').material_select();
    ticketPrefix.value  = jiraOpts.ticketPrefix;
    baseURL.value  = jiraOpts.baseURL;

    let allOpts = [baseURL, projectId, ticketPriority, ticketPrefix];

    function saveCurrentJiraOptions() {
        saveJiraOptions(projectId.value, 1, ticketPriority.value, baseURL.value, ticketPrefix.value);
    }

    allOpts.forEach(opt => {
        opt.onchange = saveCurrentJiraOptions;
    });

    // List all installed extensions
    // chrome.management.getAll(function(extInfos) {
        // extInfos.forEach(function(ext) {
            // console.log(JSON.stringify(ext));
            // });
            // });
});
