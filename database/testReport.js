const { generateJSONReport, generateHTMLReport } = require('./ReportGenerator');

function main() {
  const runId = 1;

  try {
    const jsonPath = generateJSONReport(runId);
    console.log('JSON report saved to:', jsonPath);

    const htmlPath = generateHTMLReport(runId);
    console.log('HTML report saved to:', htmlPath);
  } catch (error) {
    console.error('Report generation failed:', error.message);
    process.exit(1);
  }
}

main();
