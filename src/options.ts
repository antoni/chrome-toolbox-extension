/**
 * Other battery icon sets:
 *
 *    * http://www.iconarchive.com/show/vista-hardware-devices-icons-by-icons-land/Battery-Power-Full-icon.html
 *    * http://www.softicons.com/object-icons/original-battery-icon-by-mythique-design/battery-icon
 *
 */

import * as $ from "jquery";

class JiraOptions {
    // Base URL
    public baseURL: string;
    // Issue type
    public issueType: number;
    // Project Id
    public pid: number;
    // Priority
    public priority: number;
    // Ticket prefix
    public ticketPrefix: string;
}

const materialSelect = () => $("select").material_select();

const saveJiraOptions = (baseURL, issueType, pid, priority, ticketPrefix) => {
    const jiraOptions: JiraOptions = {
        baseURL,
        issueType,
        pid,
        priority,
        ticketPrefix,
    };

    localStorage.jiraOptions = JSON.stringify(jiraOptions);
};

const initDefaultJiraOptions = () => { saveJiraOptions(16700, 1, 3, "", ""); };

window.addEventListener("load", () => {
    const close1 = document.getElementById("close");
    const close2 = document.getElementById("jira-save");
    close1.addEventListener("click", () => { window.close(); });
    close2.addEventListener("click", () => { saveCurrentJiraOptions(); window.close(); });
    materialSelect();

    const options = document.getElementById("options") as HTMLFormElement;

    const percentage = options.percentage;
    if (localStorage.percentage !== undefined) {
        $("#percentage").val(localStorage.percentage).change();
        materialSelect();

    }
    percentage.onchange = () => { localStorage.percentage = options.percentage.value; };

    // Experimental
    const accountNo = options.accountNo;
    if (localStorage.accountNo !== undefined) {
        $("#accountNo").val(localStorage.accountNo).change();
        materialSelect();
    }
    accountNo.onchange = () => { localStorage.accountNo = options.accountNo.value; };

    // JIRA

    if (localStorage.jiraOptions === undefined) {
        initDefaultJiraOptions();
    }

    const jiraOpts = JSON.parse(localStorage.jiraOptions);

    const jiraOptionsForm = document.getElementById("jira_options") as HTMLFormElement;

    const baseURL = jiraOptionsForm.jira_base_url;
    const projectId = jiraOptionsForm.jira_project_id;
    const ticketPriority = jiraOptionsForm.jira_ticket_priority;
    const ticketPrefix = jiraOptionsForm.jira_ticket_prefix;

    projectId.value = jiraOpts.pid;
    ticketPriority.value = jiraOpts.priority;
    materialSelect();
    ticketPrefix.value = jiraOpts.ticketPrefix;
    baseURL.value = jiraOpts.baseURL;

    const allOpts = [baseURL, projectId, ticketPriority, ticketPrefix];

    const saveCurrentJiraOptions = () => {
        saveJiraOptions(projectId.value, 1, ticketPriority.value, baseURL.value, ticketPrefix.value);
    };

    allOpts.forEach((opt) => opt.onchange = saveCurrentJiraOptions);
});
