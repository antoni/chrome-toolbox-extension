// Gets vote value for a given node of class `answer`
const getVotes = x => parseInt(x.querySelector('div > div.votecell.post-layout--left > div > span.vote-count-post').innerText);

const answers = document.getElementById('answers');
Array.prototype.slice.call(answers.children)
               .map(node => answers.removeChild(node))
               .filter(node => 'DIV' === node.tagName && node.className.startsWith('answer'))
               .sort((node1, node2) => getVotes(node2) - getVotes(node1))
               .forEach(node => answers.appendChild(node));