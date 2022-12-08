import styled from 'styled-components'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

export default function Sample() {
  return (
    <Container>
      <h1>Sample Page</h1>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`

// SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  const originUrl = context.req.headers.host;
  const fetchUrl = `${originUrl?.search("http://") !== -1 ? originUrl : ("http://" + originUrl)}/api/hello`;
  const fetchResult = await fetch(fetchUrl).then(response => response.json());

  return {
    props: {
      data: fetchResult
    }
  }
}

// ISR
// export const getStaticProps: GetStaticProps = async () => {
//   return {
//     props: { data },
//     revalidate: 6000,
//   };
// }

// SSG
// export const getStaticProps: GetStaticProps = async () => {
//   return {
//     props: { data }
//   }
// }

// No prerender
// export default dynamic(() => Promise.resolve(NoneSsr), { ssr: false });