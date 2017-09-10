/**
* Other battery icon sets: 
*          
*    * http://www.iconarchive.com/show/vista-hardware-devices-icons-by-icons-land/Battery-Power-Full-icon.html
*    * http://www.softicons.com/object-icons/original-battery-icon-by-mythique-design/battery-icon
*
*/

import * as $ from 'jquery';

class JiraOptions {
    // Base URL
    baseURL: string
    // Ticket prefix
    ticketPrefix: string
    // Project Id
    pid: number
    // Issue type
    issueType: number
    // Priority
    priority: number
}

const material_select = () => $('select').material_select();

function saveJiraOptions(pid, issueType, priority, baseURL, ticketPrefix) {
    const jiraOptions: JiraOptions = {
        baseURL: baseURL,
        ticketPrefix: ticketPrefix,
        pid: pid,
        issueType: issueType,
        priority: priority,
    }
    
    localStorage.jiraOptions = JSON.stringify(jiraOptions);
}

function initDefaultJiraOptions() {
    saveJiraOptions(16700, 1, 3, '', '')
}

window.addEventListener('load', function () {
    var close1 = document.getElementById('close');
    var close2 = document.getElementById('jira-save');
    close1.addEventListener('click', function () {
        window.close();
    });
    close2.addEventListener('click', function () {
        saveCurrentJiraOptions();
        window.close();
    });
    material_select();

    var options = <HTMLFormElement>document.getElementById("options");

    var percentage = options.percentage;
    if (localStorage.percentage !== undefined) {
        $('#percentage').val(localStorage.percentage).change();
        material_select();

    }
    percentage.onchange = function () {
        localStorage.percentage = options.percentage.value;
    };

    // Experimental
    var accountNo = options.accountNo;
    if (localStorage.accountNo !== undefined) {
        $('#accountNo').val(localStorage.accountNo).change();
        material_select();

    }
    accountNo.onchange = function () {
        localStorage.accountNo = options.accountNo.value;
    };

    // JIRA

    if (localStorage.jiraOptions === undefined) {
        initDefaultJiraOptions();
    }

    var jiraOpts = JSON.parse(localStorage.jiraOptions);

    var jiraOptionsForm = <HTMLFormElement>document.getElementById("jira_options");

    var baseURL = jiraOptionsForm.jira_base_url,
        projectId = jiraOptionsForm.jira_project_id,
        ticketPriority = jiraOptionsForm.jira_ticket_priority,
        ticketPrefix = jiraOptionsForm.jira_ticket_prefix;

    projectId.value = jiraOpts.pid;
    ticketPriority.value = jiraOpts.priority;
    material_select();
    ticketPrefix.value = jiraOpts.ticketPrefix;
    baseURL.value = jiraOpts.baseURL;

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
