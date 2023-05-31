import { execSync } from 'child_process';

const targets = ['lint', 'build', 'test', 'e2e'];
const shardsArg = parseInt(process.argv[2]);
if (isNaN(shardsArg)) {
  console.error(
    `First argument needs to be an integer (max shards), but was: ${process.argv[2]}`
  );
  process.exit(1);
}

targets.forEach((target) => {
  let affectedProjects;
  try {
    affectedProjects = execSync(
      `npx nx print-affected --target=${target} --select=projects --base=f017419`
    )
      .toString()
      .trim()
      .split(', ');
  } catch (error) {
    console.error('Error executing the command:', error);
    process.exit(1);
  }

  console.log(affectedProjects);

  if (affectedProjects.length === 0) {
    return;
  }

  const matrix = {};
  let amountOfShards = Math.min(
    parseInt(process.argv[2]),
    affectedProjects.length
  );
  const elementsPerShard = Math.ceil(affectedProjects.length / amountOfShards);
  for (
    let i = 0, s = 1;
    i < affectedProjects.length;
    i += elementsPerShard, s++
  ) {
    let shard = affectedProjects.slice(i, i + elementsPerShard);
    matrix[`${s}/${amountOfShards}`] = shard.join(',');
  }

  // for(let i = 1; i <= amountOfShards; i++) {
  //   matrix[`${i}/${amountOfShards}`] = []
  // }

  // e.g. lint=["example-app-seven","example-app-seven-e2e","lib-acorn"] >> $GITHUB_OUTPUT
  const output = `echo '${target}=${JSON.stringify(matrix)}' >> $GITHUB_OUTPUT`;
  console.log(output);
  // execSync(output);
});
