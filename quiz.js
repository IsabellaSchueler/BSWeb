const quizForm = document.getElementById('quiz-form');
const resultsBox = document.getElementById('quiz-results');

const correctAnswers = {
  q1: 'unique',
  q2: 'c',
  q3: 'a',
  q4: 'd',
  q5: ['a', 'c', 'd']
};

const answerLabels = {
  q1: 'unique',
  q2: 'Using a unique password and a password manager',
  q3: 'Ignore it and verify the sender through a trusted source',
  q4: 'An urgent request for personal information or payment',
  q5: ['Hover over links before clicking', 'Check the sender address carefully', 'Verify the message through a trusted channel']
};

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function renderResults(score, summary) {
  const percent = Math.round((score / 5) * 100);
  const passed = score >= 4;

  resultsBox.innerHTML = `
    <div class="result-banner ${passed ? 'pass' : 'fail'}">
      <h3>${passed ? 'Pass' : 'Fail'}</h3>
      <p>You scored ${score} out of 5 (${percent}%).</p>
    </div>
    <div class="result-list">
      ${summary.map(item => `
        <div class="result-item ${item.correct ? 'correct' : 'incorrect'}">
          <p><strong>${item.label}</strong></p>
          <p class="result-score">${item.correct ? 'Correct' : 'Incorrect'}</p>
          <p>Your answer: <span>${item.userAnswer}</span></p>
          <p>Correct answer: <span>${item.correctAnswer}</span></p>
        </div>
      `).join('')}
    </div>
  `;
}

quizForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(quizForm);
  const selectedQ5 = Array.from(document.querySelectorAll('input[name="q5"]:checked'))
    .map(input => input.value)
    .sort();

  const answers = {
    q1: normalize(formData.get('q1') || ''),
    q2: formData.get('q2') || '',
    q3: formData.get('q3') || '',
    q4: formData.get('q4') || '',
    q5: selectedQ5
  };

  let score = 0;
  const summary = [];

  const q1Correct = answers.q1 === correctAnswers.q1;
  score += q1Correct ? 1 : 0;
  summary.push({
    label: 'Question 1',
    correct: q1Correct,
    userAnswer: answers.q1 || 'No answer provided',
    correctAnswer: answerLabels.q1
  });

  const q2Correct = answers.q2 === correctAnswers.q2;
  score += q2Correct ? 1 : 0;
  summary.push({
    label: 'Question 2',
    correct: q2Correct,
    userAnswer: answers.q2 ? document.querySelector(`input[name="q2"][value="${answers.q2}"]`).parentElement.textContent.trim() : 'No answer provided',
    correctAnswer: answerLabels.q2
  });

  const q3Correct = answers.q3 === correctAnswers.q3;
  score += q3Correct ? 1 : 0;
  summary.push({
    label: 'Question 3',
    correct: q3Correct,
    userAnswer: answers.q3 ? document.querySelector(`input[name="q3"][value="${answers.q3}"]`).parentElement.textContent.trim() : 'No answer provided',
    correctAnswer: answerLabels.q3
  });

  const q4Correct = answers.q4 === correctAnswers.q4;
  score += q4Correct ? 1 : 0;
  summary.push({
    label: 'Question 4',
    correct: q4Correct,
    userAnswer: answers.q4 ? document.querySelector(`input[name="q4"][value="${answers.q4}"]`).parentElement.textContent.trim() : 'No answer provided',
    correctAnswer: answerLabels.q4
  });

  const correctSet = [...correctAnswers.q5].sort();
  const selectedSet = answers.q5;
  const q5Correct = selectedSet.length === correctSet.length && selectedSet.every((item, index) => item === correctSet[index]);
  score += q5Correct ? 1 : 0;
  summary.push({
    label: 'Question 5',
    correct: q5Correct,
    userAnswer: answers.q5.length ? answers.q5.map(value => {
      const input = document.querySelector(`input[name="q5"][value="${value}"]`);
      return input ? input.parentElement.textContent.trim() : value;
    }).join(', ') : 'No answer provided',
    correctAnswer: answerLabels.q5.join(', ')
  });

  renderResults(score, summary);
});

quizForm.addEventListener('reset', function () {
  resultsBox.innerHTML = '';
  resultsBox.className = 'quiz-results';
});
