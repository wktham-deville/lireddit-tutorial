import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { TextField } from '../../../components/TextField';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';



const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{data, fetching}] = usePostQuery({
    variables: {
      id: intId,
    },
  })
  const [,updatePost] = useUpdatePostMutation();
  if(fetching){
    <div>
      loading...
    </div>
  }
  if(!data?.post) {
    return <Layout>
      <Box>Could not find post</Box>
    </Layout>;
  }
    return (
      <Layout variant="small">
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text}}
          onSubmit={async (values) => {
            //console.log(values);
          // const {error} =  await createPost({input:values});
          // console.log("error: ", error);
          //   if (!error) {
          //     router.push("/");
          //   } 
            await updatePost({id:intId,...values});
            router.back();
          }}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <InputField
                  name="title"
                  placeholder="title"
                  label="Title" 
                  />
                <Box mt={4}>
                  <TextField
                    name="text"
                    placeholder="text..."
                    label="Body"
                  />
                </Box>
              
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                >
                  update post
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Layout>
    );
}

export default withUrqlClient(createUrqlClient)( EditPost);