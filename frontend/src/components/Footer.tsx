import React from 'react';
import { Box, Container, Text, Link, Flex } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="gray.100" py={4} mt="auto">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600">
            &copy; {new Date().getFullYear()} PDF2Markdown
          </Text>
          <Flex gap={4}>
            <Link 
              href="https://github.com/pdf2markdown" 
              target="_blank"
              rel="noopener noreferrer"
              display="flex" 
              alignItems="center"
              color="gray.600"
              _hover={{ color: 'blue.500' }}
            >
              <FaGithub style={{ marginRight: '5px' }} />
              <Text fontSize="sm">GitHub</Text>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer; 