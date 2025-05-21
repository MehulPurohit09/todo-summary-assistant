const axios = require('axios');

async function summarizeTodos(todos) {
  const prompt = 'Summarize the following to-do list:\n' + todos.map(t => '- ' + t.task).join('\n');

  const res = await axios.post('https://api.openai.com/v1/completions', {
    model: "text-davinci-003",
    prompt,
    max_tokens: 60,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  return res.data.choices[0].text.trim();
}

async function sendToSlack(message) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
}

module.exports = { summarizeTodos, sendToSlack };
