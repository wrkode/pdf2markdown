import React from 'react';
import { Box, Flex, Heading, Container, Text } from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <Box as="header" bg="blue.600" color="white" py={4} boxShadow="md">
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <FaFilePdf size={30} style={{ marginRight: '10px' }} />
            <Heading as="h1" size="lg">PDF2Markdown</Heading>
          </Flex>
          <Text fontSize="sm">Convert PDF documents to Markdown with ease</Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 