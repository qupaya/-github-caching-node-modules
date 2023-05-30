import { execSync } from 'child_process';

const targets = ['lint', 'build', 'test', 'e2e'];

targets.forEach((target) => {
  let result;
  try {
    result = execSync(
      `npx nx print-affected --target=${target} --select=projects --base=b89c574`
    )
      .toString()
      .trim();
  } catch (error) {
    console.error('Error executing the command:', error);
    process.exit(1);
  }

  result = result.length > 0 ? JSON.stringify(result.split(', ')) : '[]';
  // e.g. lint=["example-app-seven","example-app-seven-e2e","lib-acorn"] >> $GITHUB_OUTPUT
  const output = `echo '${target}=${result}' >> $GITHUB_OUTPUT`;
  console.log(output);
  execSync(output);
});
