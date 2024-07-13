import { gql } from "apollo-server";

export const createFruitForFruitStorageQuery = gql`
  mutation CreateFruitForFruitStorage(
    $name: String!
    $description: String!
    $limitOfFruitToBeStored: Int!
  ) {
    createFruitForFruitStorage(
      name: $name
      description: $description
      limitOfFruitToBeStored: $limitOfFruitToBeStored
    ) {
      id
      amount
      limit
      fruit {
        description
        id
        name
      }
    }
  }
`;

export const updateFruitForFruitStorageQuery = gql`
  mutation UpdateFruitForFruitStorage(
    $name: String!
    $description: String!
    $limitOfFruitToBeStored: Int!
  ) {
    updateFruitForFruitStorage(
      name: $name
      description: $description
      limitOfFruitToBeStored: $limitOfFruitToBeStored
    ) {
      id
      amount
      limit
      fruit {
        description
        id
        name
      }
    }
  }
`;

export const deleteFruitFromFruitStorageQuery = gql`
  mutation DeleteFruitFromFruitStorage($name: String!, $forceDelete: Boolean!) {
    deleteFruitFromFruitStorage(name: $name, forceDelete: $forceDelete) {
      id
      amount
      limit
      fruit {
        description
        id
        name
      }
    }
  }
`;

export const storeFruitToFruitStorageQuery = gql`
  mutation StoreFruitToFruitStorage($name: String!, $amount: Int!) {
    storeFruitToFruitStorage(name: $name, amount: $amount) {
      id
      amount
      limit
      fruit {
        description
        id
        name
      }
    }
}
`;

export const removeFruitFromFruitStorageQuery = gql`
  mutation RemoveFruitFromFruitStorage($name: String!, $amount: Int!) {
    removeFruitFromFruitStorage(name: $name, amount: $amount) {
      id
      amount
      limit
      fruit {
        description
        id
        name
      }
    }
  }
`;

export const findFruitQuery = gql`
  query FindFruit($name: String!) {
    findFruit(name: $name) {
      id
      amount
      limit
      fruit {
        description
        id
        name
      }
    }
  }
`;
