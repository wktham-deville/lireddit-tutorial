import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from "next/router";
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { TextField } from '../components/TextField';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [,createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: ""}}
        onSubmit={async (values) => {
          //console.log(values);
         const {error} =  await createPost({input:values});
         console.log("error: ", error);
          if (!error) {
            router.push("/");
          } 
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
                create post
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);