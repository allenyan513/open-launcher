import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Markdown,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export const WelcomeEmail = (props: { userName: string }) => {
  const { userName } = props;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          Welcome to FF2050.AI! We are excited to have you on board. Click
          the button below to get started.
        </Preview>
        <Container style={container}>
          <Section style={box}>
            <Img
              style={logo}
              src={`https://ai.ff2050.com/img/favicon-32.png`}
              width="49"
              height="49"
              alt="ff2050.ai logo"
            />
            <Text style={paragraph}>Dear {userName || 'User'},</Text>
            <Text style={paragraph}>
              Thank you for signing up FF2050.AI, we are glad to see you
              here!
            </Text>
            <Text style={paragraph}>
              You can submit issues and ask questions on our GitHub. If you want
              to support us, your ⭐ will make us more motivated!
            </Text>
            <Button style={button} href="https://ai.ff2050.com/dashboard">
              Go to Dashboard
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  padding: '16px',
  color: 'black',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
};

const logo = {
  display: 'block',
  margin: '0 auto',
};

const box = {
  padding: '0 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const anchor = {
  color: '#556cd6',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  cursor: 'pointer',
};

const footer = {
  textAlign: 'center' as const,
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
