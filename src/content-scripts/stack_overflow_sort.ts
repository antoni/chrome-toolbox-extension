// ["https://stackoverflow.com/*"]
// Returns # of votes for a given node of class `answer`
const getVotes = (x: Element) => Number(
  (x!.querySelector(
    'div > div.votecell.post-layout--left > div > div.js-vote-count') as
    HTMLElement)!.innerText);

const answersDiv = document.getElementById('answers') as HTMLElement;

const answersHeader = document.getElementById('tabs') as HTMLElement;
if (answersHeader.parentNode) {
  answersHeader.parentNode!.removeChild(answersHeader);
}

const bottomNotice =
  document.getElementsByClassName('bottom-notice')[0] as HTMLElement;
if (bottomNotice && bottomNotice.parentNode) {
  bottomNotice.parentNode.removeChild(bottomNotice);
}

const postAnswerForm = document.getElementById('post-form');

const sidebar = document.getElementById('sidebar') as HTMLElement;
if (sidebar.parentNode) {
  sidebar.parentNode.removeChild(sidebar);
}

// Sort answers by # of votes
let answers = Array.from(document.getElementsByClassName('answer'));
answers.sort((node1, node2) => getVotes(node2) - getVotes(node1));

for (let i = 0, len = answers.length; i < len; i++) {
  if(answers[i]) {
  const parent = answers[i].parentNode as Node;
    const detatchedItem = parent.removeChild(answers[i]);

    // Hide answers with negative # of votes
    if (getVotes(answers[i]) < 0) {
      continue;
    }
    parent.appendChild(detatchedItem);
  }
}

if (postAnswerForm) { // There is no answer form on closed questions, etc.
  answersDiv.appendChild(postAnswerForm as HTMLElement);
}