import { createSelector } from 'reselect';
import { StoreState } from 'src/store';
import fuzzysearch from 'src/utils/fuzzysearch';
import { OperationDocumentation } from 'src/App/types';
import { MenuRessource } from './types';

function filterOperations(
  query: string,
  operations: OperationDocumentation[],
): OperationDocumentation[] {
  if (query) {
    return operations.filter(operation => fuzzysearch(query, operation.path));
  }
  return operations;
}

function getRessourceName(operation: OperationDocumentation): string {
  const splittedPath = operation.path.split('/');
  if (splittedPath.length === 0) {
    return '/';
  }
  if (splittedPath.length === 1) {
    if (splittedPath[0] !== '') {
      return splittedPath[0];
    }
    return '/';
  }

  if (splittedPath[0] !== '') {
    return splittedPath[0];
  }

  // we are sure to have 2 items in splittedPath[1] because cases with 0 or 1 item are handle above
  return splittedPath[1];
}

function createRessource(name: string, operation: OperationDocumentation): MenuRessource {
  return {
    name,
    operations: [
      {
        id: operation.id,
        value: {
          method: operation.method,
          path: operation.path,
        },
      },
    ],
  };
}

function addOperationInRessource(
  ressource: MenuRessource,
  operation: OperationDocumentation,
): MenuRessource {
  const newOperation = {
    id: operation.id,
    value: {
      method: operation.method,
      path: operation.path,
    },
  };

  return {
    ...ressource,
    operations: [...ressource.operations, newOperation],
  };
}

function getMenuRessources(operations: OperationDocumentation[]): MenuRessource[] {
  return operations.reduce(
    (ressources, operation) => {
      const ressourceName = getRessourceName(operation);
      const ressourceExists = ressources.some(({ name }) => name === ressourceName);

      if (ressourceExists) {
        return ressources.map(ressource => {
          if (ressource.name === ressourceName) {
            return addOperationInRessource(ressource, operation);
          }
          return ressource;
        });
      }

      const newRessource = createRessource(ressourceName, operation);

      return [...ressources, newRessource];
    },
    [] as MenuRessource[],
  );
  return [];
}

const selectOperations = createSelector(
  (state: StoreState) => state.filterQuery,
  (state: StoreState) => state.operations,
  (filterQuery: string, operations: OperationDocumentation[]) =>
    filterOperations(filterQuery, operations),
);

const selectRessources = createSelector(selectOperations, getMenuRessources);

export { filterOperations, getMenuRessources, selectRessources };
