import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import React from 'react';
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonProps> = ({
  id,
  creatorId
}) => {
  const [,deletePost] = useDeletePostMutation();
  const [{data: meData}] = useMeQuery();
  if(meData?.me?.id !== creatorId){
    return null;
  }else{
    return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton 
          mr={4}
          icon={<EditIcon/>} 
          aria-label="Edit Post">
        </IconButton>
      </NextLink>
      <IconButton 
        icon={<DeleteIcon/>} 
        aria-label="Delete Post" 
        onClick={() => {
        deletePost({id});
      }}/>
      </Box>
    );
  }
}