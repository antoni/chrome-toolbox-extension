/**
 * Other battery icon sets:
 *
 *    * http://www.iconarchive.com/show/vista-hardware-devices-icons-by-icons-land/Battery-Power-Full-icon.html
 *    * http://www.softicons.com/object-icons/original-battery-icon-by-mythique-design/battery-icon
 *
 */

import * as $ from "jquery";
import { executeClickInTab } from "./modules/utils"

declare global {
    interface JQuery {
        material_select: () => JQuery;
    }
}

declare var material_select:JQueryStatic;

enum IssueType {
    BLOCKER = 0,
    BUG = 1,
    NEW_FEATURE = 2,
    TASK = 3,
    IMPROVEMENT = 4,
    EPIC = 5,
    STORY = 6,
    TECHNICAL_TASK = 7,
    A_PART_OF_LARGE_TASK = 8,
    TECHNICAL_DEBT = 9,
}

enum Priority {
    BLOCKER = 1,
    CRITICAL = 2,
    MAJOR = 3,
    MINOR = 4,
}

enum PersonalProjects {
    ADNETWORK = 16700,
    LAMI = 18700,
}

const DEFAULT_ISSUE_TYPE = IssueType.BUG;
const DEFAULT_PROJECT_ID = PersonalProjects.LAMI;

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

const handleFileSelect = (input: HTMLInputElement, lineHandler: (line: string) => any) => {
    // TODO: FIX
    // if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    //     alert('The File APIs are not fully supported in this browser.');
    //     return;
    // }

    // TODO: Callbacks instead of console.log()
    if (!input) {
        console.log("Couldn't find the fileinput element.");
    } else if (!input.files) {
        console.log("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        console.log("Please select a file before clicking 'Load'");
    } else {
        let file = input.files[0];
        let fr = new FileReader();
        fr.onload = (function (file) {
            return function (e) { this.result.split('\n').forEach(lineHandler); }
        })(file);

        fr.readAsText(file);
    }

    // Reconfigure onchange handler
    input.onchange = (event: Event) => { handleFileSelect(input, line => console.log(line)); }
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

const initDefaultJiraOptions = () => { saveJiraOptions("kredito.atlassian.net", 3, 16700, 1, "LAMI-"); };

// const JIRA_CREATE_CLICK_DELAY = 5000;
const JIRA_CREATE_CLICK_DELAY = 7000;

const jiraTicketUrlClick = (url: string) => {
    if (url == "") return;

    const tabCreateCallback = tabId => setTimeout(() => {
        executeClickInTab(tabId, "issue-create-submit", () => alert("Error creating JIRA issue!"));
    }, JIRA_CREATE_CLICK_DELAY);

    chrome.tabs.create({
        // url: "https://google.com",
        url: url,
        index: 0,
        pinned: true,
        active: false
    }, tab => tabCreateCallback(tab.id))
}

window.addEventListener("load", () => {

    let input = <HTMLInputElement>document.getElementById('jira_link_list');
    input.onchange = (event: Event) => {
        // handleFileSelect(input, line => console.log(line));
        handleFileSelect(input, line => jiraTicketUrlClick(line));
    }
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

    const jiraOptions = JSON.parse(localStorage.jiraOptions);

    const jiraOptionsForm = document.getElementById("jira_options") as HTMLFormElement;

    const baseURL = jiraOptionsForm.jira_base_url;
    const projectId = jiraOptionsForm.jira_project_id;
    const ticketPriority = jiraOptionsForm.jira_ticket_priority;
    const ticketPrefix = jiraOptionsForm.jira_ticket_prefix;

    projectId.value = jiraOptions.pid;
    ticketPriority.value = jiraOptions.priority;
    materialSelect();
    ticketPrefix.value = jiraOptions.ticketPrefix;
    baseURL.value = jiraOptions.baseURL;

    const allOpts = [baseURL, projectId, ticketPriority, ticketPrefix];

    const saveCurrentJiraOptions = () => {
        saveJiraOptions(baseURL.value, DEFAULT_ISSUE_TYPE, projectId.value, ticketPriority.value, ticketPrefix.value);
    };

    allOpts.forEach(opt => opt.onchange = saveCurrentJiraOptions);
});
