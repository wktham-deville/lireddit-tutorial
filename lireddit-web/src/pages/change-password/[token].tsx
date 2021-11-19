import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import login from "../login";
import NextLink from "next/link";

const ChangePassword: NextPage<{token: string}> = ({}) => {
    const router = useRouter();
    const[,changePassword] = useChangePasswordMutation();
    const [tokkenError, setTokenError] = useState("");
    return (<Wrapper variant="small">
    <Formik
      initialValues={{ newPassword: "" }}
      onSubmit={async(values, {setErrors}) => {
        const response = await changePassword({
          newPassword: values.newPassword, 
          token:typeof router.query.token === "string" ? router.query.token : ""});
        if (response.data?.changePassword.errors) {
          const errorMap = toErrorMap(response.data.changePassword.errors);
          if('token' in errorMap){
            setTokenError(errorMap.token);
          }
          setErrors(errorMap);
        } else if (response.data?.changePassword.user) {
            router.push("/");
        }
      }}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password" />
            {tokkenError? (
              <Flex>
                <Box color='red' mr={2}>{tokkenError}</Box> 
                <NextLink href="/forgot-password">
                  <Link> get a new password</Link>
                </NextLink>
              </Flex>
              ): null }
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              change password
            </Button>
          </Form>
        );
      }}
    </Formik>
  </Wrapper>);
};

export default withUrqlClient(createUrqlClient) (ChangePassword);