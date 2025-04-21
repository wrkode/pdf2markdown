import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  VStack, 
  Heading, 
  useToast, 
  Flex, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Card,
  CardBody
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaFileUpload, FaDownload, FaCheckCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const PdfConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(false);
  const [filename, setFilename] = useState('');
  
  const toast = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setConverted(false);
        setMarkdown('');
      }
    }
  });

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a PDF file first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const response = await axios.post('/api/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setMarkdown(response.data.markdown);
        setFilename(response.data.filename);
        setConverted(true);
        toast({
          title: 'Conversion successful',
          description: 'Your PDF has been converted to Markdown',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: 'Conversion failed',
        description: 'There was an error converting your PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!markdown) return;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download started',
      description: 'Your Markdown file is being downloaded',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading size="xl" mb={2}>PDF to Markdown Converter</Heading>
        <Text color="gray.600">Upload your PDF file and convert it to Markdown format</Text>
      </Box>

      <Card variant="outline">
        <CardBody>
          <VStack spacing={6}>
            <Box 
              {...getRootProps()} 
              w="100%" 
              h="200px" 
              border="2px dashed" 
              borderColor={isDragActive ? "blue.400" : "gray.300"}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={isDragActive ? "blue.50" : "gray.50"}
              transition="all 0.2s"
              _hover={{ bg: "blue.50", borderColor: "blue.400" }}
              cursor="pointer"
              p={6}
            >
              <input {...getInputProps()} />
              <VStack spacing={2}>
                <FaFileUpload size={40} color={isDragActive ? "#3182CE" : "#A0AEC0"} />
                <Text color="gray.600" fontWeight="medium">
                  {isDragActive
                    ? "Drop your PDF here..."
                    : file
                    ? `Selected: ${file.name}`
                    : "Drag & drop your PDF here, or click to select"}
                </Text>
                {file && (
                  <Text fontSize="sm" color="green.500" display="flex" alignItems="center">
                    <FaCheckCircle style={{ marginRight: '5px' }} /> File selected
                  </Text>
                )}
              </VStack>
            </Box>

            <Button 
              colorScheme="blue" 
              size="lg" 
              leftIcon={<FaFileUpload />}
              onClick={handleConvert}
              isLoading={loading}
              loadingText="Converting..."
              isDisabled={!file || loading}
              w={{ base: "100%", md: "auto" }}
            >
              Convert to Markdown
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {converted && (
        <Card variant="outline">
          <CardBody>
            <VStack spacing={4} align="start">
              <Flex justify="space-between" w="100%" align="center">
                <Heading size="md">Conversion Result</Heading>
                <Button 
                  colorScheme="green" 
                  leftIcon={<FaDownload />}
                  onClick={handleDownload}
                >
                  Download Markdown
                </Button>
              </Flex>

              <Tabs isFitted width="100%">
                <TabList>
                  <Tab>Preview</Tab>
                  <Tab>Raw Markdown</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      minH="300px" 
                      maxH="500px"
                      overflowY="auto"
                      bg="white"
                    >
                      <ReactMarkdown>
                        {markdown}
                      </ReactMarkdown>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      minH="300px" 
                      maxH="500px"
                      overflowY="auto"
                      bg="gray.50"
                      fontFamily="mono"
                      whiteSpace="pre-wrap"
                    >
                      {markdown}
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default PdfConverter; 