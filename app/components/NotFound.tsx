import {useTranslation} from '~/lib/utils';
import {Button} from './Button';
import {FeaturedSection} from './FeaturedSection';
import {PageHeader, Text} from './Text';

export function NotFound({type = 'page'}: {type?: string}) {
  const {t} = useTranslation();
  const heading = t('we_lost_this', {type});
  const description = t('we_couldnt_find', {type});

  return (
    <>
      <PageHeader heading={heading} className="container">
        <Text width="narrow" as="p">
          {description}
        </Text>

        <Button width="auto" variant="secondary" to={'/'}>
          {t('take_me_home')}
        </Button>
      </PageHeader>
      <FeaturedSection />
    </>
  );
}
