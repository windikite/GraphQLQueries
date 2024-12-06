import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(input: {title: $title, body: $body}) {
      id
      title
      body
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      body
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      data {
        id
        title
        body
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;
