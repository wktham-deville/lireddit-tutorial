import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Box, Heading } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostsDocument, PostSnippetFragment, PostsQuery, useVoteMutation, VoteMutation } from '../generated/graphql';
import {ApolloCache} from "@apollo/client";
import gql from 'graphql-tag';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
  const[loadingState,setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'> ('not-loading');
  const [_,vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton 
        onClick={async () =>{
          if(post.voteStatus === 1){
            return;
          }
          setLoadingState('updoot-loading');
          await vote({
            postId: post.id,
            value: 1,
            },
          );
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus === 1? "green": undefined}
        isLoading={loadingState === "updoot-loading"}
        aria-label="Upvote" 
        icon={<ChevronUpIcon/>} 
        w={6} h={6} 
      />
      {post.points}
      <IconButton
        onClick={async() =>{
          if(post.voteStatus === -1){
            return;
          }
          setLoadingState('downdoot-loading');
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState('not-loading');
        }}
        colorScheme={post.voteStatus === -1? "red": undefined} 
        isLoading={loadingState === "downdoot-loading"}
        aria-label="Downvote" 
        icon={<ChevronDownIcon/>} 
        w={6} h={6} 
      />
    </Flex>
  );
}