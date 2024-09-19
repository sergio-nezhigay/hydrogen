import {PageHeader, Section} from '~/components/Text';
import {Test} from '~/modules/NavigationMenuBlock';

export default function AllProducts() {
  return (
    <>
      <Section>
        <PageHeader
          heading="Каталог"
          variant="allCollections"
          className="container"
        />
        <h1>test</h1>
        <Test />
      </Section>
    </>
  );
}
