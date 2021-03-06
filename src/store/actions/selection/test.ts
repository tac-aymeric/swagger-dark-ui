import * as utils from './utils';

const SwaggerBaseSchema: SwaggerSchema = {
  swagger: '2.0',
  info: {
    version: '1.0',
    title: 'Giphy',
    description: 'Description',
  },
  host: 'api.giphy.com',
  basePath: '/v1',
  schemes: ['http'],
  securityDefinitions: {
    api_key: {
      name: 'api_key',
      type: 'apiKey',
      in: 'query',
    },
  },
  paths: {},
};

describe('getBaseUrl', () => {
  test('Should return base url with protocol', () => {
    const swaggerSchema = SwaggerBaseSchema;

    const expectedValue = 'http://api.giphy.com/v1';

    expect(utils.getBaseUrl(swaggerSchema)).toBe(expectedValue);
  });

  test('Should return base url without protocol', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      schemes: [],
    };

    const expectedValue = 'api.giphy.com/v1';

    expect(utils.getBaseUrl(swaggerSchema)).toBe(expectedValue);
  });
});

describe('getOperations', () => {
  test('Should return empty list', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {},
    };

    expect(utils.getOperations(swaggerSchema)).toEqual([]);
  });

  test("Should return empty list when path hasn't any method", () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {},
      },
    };

    expect(utils.getOperations(swaggerSchema)).toEqual([]);
  });

  test('Should return 1 method', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    expect(apiOperations.length).toBe(1);
    expect(apiOperations[0].path).toBe('/gifs/search');
    expect(apiOperations[0].method).toBe('get');
    expect(apiOperations[0].id).toBe('search_get');
  });

  test('Should return 2 methods for 2 paths', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
        },
        '/gifs/find': {
          post: {
            operationId: 'find_post',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    expect(apiOperations.length).toBe(2);
    expect(apiOperations[0].path).toBe('/gifs/search');
    expect(apiOperations[0].method).toBe('get');
    expect(apiOperations[0].id).toBe('search_get');
    expect(apiOperations[1].path).toBe('/gifs/find');
    expect(apiOperations[1].method).toBe('post');
    expect(apiOperations[1].id).toBe('find_post');
  });

  test('Should return 2 method for 1 path', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            parameters: [],
            tags: [],
            produces: [],
            responses: {},
          },
          post: {
            operationId: 'search_post',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    expect(apiOperations.length).toBe(2);
    expect(apiOperations[0].path).toBe('/gifs/search');
    expect(apiOperations[0].method).toBe('get');
    expect(apiOperations[0].id).toBe('search_get');
    expect(apiOperations[1].path).toBe('/gifs/search');
    expect(apiOperations[1].method).toBe('post');
    expect(apiOperations[1].id).toBe('search_post');
  });

  test('Should return 1 method with 0 response', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationResponses = apiOperations[0].responses;

    expect(operationResponses.length).toBe(0);
  });

  test('Should return 1 method with 1 response', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {
              // tslint:disable-next-line object-literal-key-quotes
              '200': {
                description: 'Response description',
                schema: { type: 'string' },
                examples: {
                  'application/json': 'Response example',
                },
              },
            },
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationResponses = apiOperations[0].responses;

    expect(operationResponses.length).toBe(1);
    expect(operationResponses[0].code).toBe(200);
    expect(operationResponses[0].description).toBe('Response description');
    expect(operationResponses[0].example).toBe('Response example');
  });

  test('Should return 1 method with 2 responses', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {
              // tslint:disable-next-line object-literal-key-quotes
              '200': {
                description: 'Response description',
                schema: { type: 'string' },
                examples: {
                  'application/json': 'Response example',
                },
              },
              // tslint:disable-next-line object-literal-key-quotes
              '400': {
                description: 'Bad request description',
                schema: { type: 'string' },
                examples: {
                  'application/json': 'Bad request example',
                },
              },
            },
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationResponses = apiOperations[0].responses;

    expect(operationResponses.length).toBe(2);
    expect(operationResponses[0].code).toBe(200);
    expect(operationResponses[0].description).toBe('Response description');
    expect(operationResponses[0].example).toBe('Response example');
    expect(operationResponses[1].code).toBe(400);
    expect(operationResponses[1].description).toBe('Bad request description');
    expect(operationResponses[1].example).toBe('Bad request example');
  });

  test('Should return 1 method without parameters', () => {
    const swaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationParams = apiOperations[0].params;

    expect(operationParams.header.length).toBe(0);
    expect(operationParams.query.length).toBe(0);
    expect(operationParams.path.length).toBe(0);
  });

  test('Should return 1 method with parameters', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [
              { in: 'header', name: 'header-param', type: 'string', required: true },
              { in: 'query', name: 'query-param', type: 'string', required: true },
              { in: 'path', name: 'path-param', type: 'string', required: true },
              { in: 'body', name: 'body-param', type: 'string', required: true },
            ],
            responses: {},
          },
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationParams = apiOperations[0].params;

    expect(operationParams.header.length).toBe(1);
    expect(operationParams.header[0].name).toBe('header-param');
    expect(operationParams.query.length).toBe(1);
    expect(operationParams.query[0].name).toBe('query-param');
    expect(operationParams.path.length).toBe(1);
    expect(operationParams.path[0].name).toBe('path-param');
  });
  test('Should return 1 method with parameters from path', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
          parameters: [
            { in: 'header', name: 'path-header-param', type: 'string', required: true },
            { in: 'query', name: 'path-query-param', type: 'string', required: true },
            { in: 'path', name: 'path-path-param', type: 'string', required: true },
            { in: 'body', name: 'path-body-param', type: 'string', required: true },
          ],
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationParams = apiOperations[0].params;

    expect(operationParams.header.length).toBe(1);
    expect(operationParams.header[0].name).toBe('path-header-param');
    expect(operationParams.query.length).toBe(1);
    expect(operationParams.query[0].name).toBe('path-query-param');
    expect(operationParams.path.length).toBe(1);
    expect(operationParams.path[0].name).toBe('path-path-param');
  });
  test('Should return 1 method with parameters from path and operation', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [
              { in: 'header', name: 'header-param', type: 'string', required: true },
              { in: 'query', name: 'query-param', type: 'string', required: true },
              { in: 'path', name: 'path-param', type: 'string', required: true },
              { in: 'body', name: 'body-param', type: 'string', required: true },
            ],
            responses: {},
          },
          parameters: [
            { in: 'header', name: 'path-header-param', type: 'string', required: true },
            { in: 'query', name: 'path-query-param', type: 'string', required: true },
            { in: 'path', name: 'path-path-param', type: 'string', required: true },
            { in: 'body', name: 'path-body-param', type: 'string', required: true },
          ],
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    const operationParams = apiOperations[0].params;

    expect(operationParams.header.length).toBe(2);
    expect(operationParams.header[0].name).toBe('path-header-param');
    expect(operationParams.header[1].name).toBe('header-param');
    expect(operationParams.query.length).toBe(2);
    expect(operationParams.query[0].name).toBe('path-query-param');
    expect(operationParams.query[1].name).toBe('query-param');
    expect(operationParams.path.length).toBe(2);
    expect(operationParams.path[0].name).toBe('path-path-param');
    expect(operationParams.path[1].name).toBe('path-param');
  });
  test('Should have body equals to null', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [],
            responses: {},
          },
          parameters: [],
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    expect(apiOperations[0].body).toBe(null);
  });
  test('Should have a body without example', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [
              {
                name: 'body',
                in: 'body',
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                },
              },
            ],
            responses: {},
          },
          parameters: [],
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    expect(apiOperations[0].body).not.toBe(null);
    expect(apiOperations[0].body!.example).toBe(null);
    expect(apiOperations[0].body!.schema).toEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    });
  });
  test('Should have a body with example', () => {
    const swaggerSchema: SwaggerSchema = {
      ...SwaggerBaseSchema,
      paths: {
        '/gifs/search': {
          get: {
            operationId: 'search_get',
            summary: 'Summary',
            description: 'Description',
            tags: [],
            produces: [],
            parameters: [
              {
                name: 'body',
                in: 'body',
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                  example: {
                    name: 'wave',
                  },
                },
              },
            ],
            responses: {},
          },
          parameters: [],
        },
      },
    };

    const apiOperations = utils.getOperations(swaggerSchema);
    expect(apiOperations[0].body).not.toBe(null);
    expect(apiOperations[0].body!.example).not.toBe(null);
    expect(apiOperations[0].body!.schema).not.toBe(null);
  });
});
