import React from 'react'
import {Form, Formik} from 'formik'
import { Button } from '@chakra-ui/button';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Flex, Link } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link";

//interface registerProps {}

const Login:React.FC<{}> = ({}) =>{
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async(values, {setErrors}) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if(typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }  
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="Username or Email" 
                />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password" 
                />
              </Box>
              <Flex mt={2}>
                <NextLink href="/forgot-password">
                  <Link ml="auto"> Forgot password?</Link>
                </NextLink>
              </Flex>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}


export default withUrqlClient(createUrqlClient)(Login);