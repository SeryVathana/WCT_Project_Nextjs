import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text, Heading } from '@react-email/components';
import { Tailwind } from '@react-email/components';

export type EmailMessageType = {
  recName: string;
  itemLink: string;
  itemName: string;
  lastBidAmount: number;
};

export const EmailTemplate = ({ recName = 'Guest', itemName, lastBidAmount, itemLink = 'Zeno' }: EmailMessageType) => {
  return (
    <Html>
      <Head />
      <Preview>New message from Auctionaire.</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Heading>Hey {recName}, someone over bid you.</Heading>

              <Hr />
              <Text>Item name: {itemName}</Text>
              <Text>Your last bid amount: ${lastBidAmount}</Text>
              <Button href={itemLink} className='px-5 py-5 rounded-md bg-blue-700 text-xs font-bold text-white'>
                Place your bid now!
              </Button>
              <Hr />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
