import { execSync } from 'child_process';

const targets = ['lint', 'build', 'test', 'e2e'];

targets.forEach((target) => {
  let result;
  try {
    result = execSync(
      `npx nx print-affected --target=${target} --select=projects`
    )
      .toString()
      .trim();
  } catch (error) {
    console.error('Error executing the command:', error);
    process.exit(1);
  }

  console.log(
    // e.g. lint=["example-app-seven","example-app-seven-e2e","lib-acorn"] >> $GITHUB_OUTPUT
    `${target}=${JSON.stringify(result.split(', '))} >> $GITHUB_OUTPUT`
  );
});
