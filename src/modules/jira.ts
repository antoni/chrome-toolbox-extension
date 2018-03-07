import { KEY_ENTER } from "../constants"
import { clearAllNotifications, websiteSearch } from "./utils"

export const setupJiraControls = () => {

if (!localStorage.jiraOptions) {
             chrome.runtime.openOptionsPage();
             return
            }

    // JIRA
    const jiraOptions = JSON.parse(localStorage.jiraOptions)
    const baseURL = jiraOptions.baseURL;
    const projectId = jiraOptions.pid;
    const issueType = jiraOptions.issueType;
    const priority = jiraOptions.priority;
    const ticketPrefix = jiraOptions.ticketPrefix;

    // Add JIRA bug
    $("#jira_bug_summary").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const bugSummary = $("#jira_bug_summary").val();
            const url = `https:\/\/${baseURL}\/secure\/CreateIssueDetails!`
                + `init.jspa?pid=${projectId}&summary=${bugSummary}&issuetype=`
                + `${issueType}&priority=${priority}`;
            chrome.tabs.create({ url });
            return false;
        }
    })

    // Open JIRA ticket
    $("#jira_ticket_id").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const searchURL = `https:\/\/${baseURL}/browse/${ticketPrefix}`;
            websiteSearch(searchURL, $("#jira_ticket_id").val());
            return false;
        }
    })

    clearAllNotifications();
}