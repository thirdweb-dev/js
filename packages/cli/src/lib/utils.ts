import * as toml from '@iarna/toml';
import * as yaml from 'js-yaml';

import { PackageManagerType } from '../core/types/ProjectType';
import { existsSync, readFileSync } from 'fs';

export const parsePackageJson = (packageJson: Buffer) => {
  const packageJsonContent = JSON.parse(packageJson.toString());
  const dependencies = packageJsonContent.dependencies || {};
  const devDependencies = packageJsonContent.devDependencies || {};
  return { dependencies, devDependencies };
}

export const parseRequirementsTxt = (requirementsTxt: Buffer) => {
  const requirementsTxtContent = requirementsTxt.toString();
  const dependencies = requirementsTxtContent.split("\n");
  return { dependencies };
};

export const parsePipFile = (PipFile: string) => {
  const pipfile = toml.parse(PipFile);
  const dependencies = pipfile.packages as string[] || [];
  const devDependencies = pipfile['dev-packages'] as string[] || [];
  return {
    dependencies,
    devDependencies
  };
};

export const parsePyProjectToml = (pyProjectToml: string) => {
  const pyProjectFile = toml.parse(pyProjectToml) as any;
  const dependencies = pyProjectFile['tool']['poetry']['dependencies'] as string[] || [];
  const devDependencies = pyProjectFile['tool']['poetry']['dev-dependencies'] as string[] || [];
  return {
    dependencies,
    devDependencies,
  }
};

export const parseCondaYml = (condaYml: string) => {
  const conda = yaml.load(condaYml) as any;
  const dependencies = conda.dependencies as string[] || [];
  return {
    dependencies,
  }
};

export const getDependenciesForPython = (path: string, packageManager: PackageManagerType) => {
  let dependencies: string[] = [];
  let devDependencies: string[] = [];

  switch(packageManager) {
    case "pip" || "pipenv":
      const foundPipFile = existsSync(path + "Pipfile");
      if (foundPipFile) {
        const pipFile = readFileSync(path + 'Pipfile', "utf-8");
        const parsedPipFile = parsePipFile(pipFile);
        dependencies = parsedPipFile.dependencies;
        devDependencies = parsedPipFile.devDependencies;
        break;
      }
      const requirementsTxt = readFileSync(path + "/requirements.txt");
      dependencies = parseRequirementsTxt(requirementsTxt).dependencies;
      break;
    case "poetry":
      const pyProjectFile = readFileSync(path + "/pyproject.toml", 'utf-8');
      dependencies = parsePyProjectToml(pyProjectFile).dependencies;
      break;
    case "conda":
      const condaYml = readFileSync(path + "/environment.yml", 'utf-8');
      dependencies = parseCondaYml(condaYml).dependencies;
    default:
      break;
  }

  return {
    dependencies,
    devDependencies
  };
}