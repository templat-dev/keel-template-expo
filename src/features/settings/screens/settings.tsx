import { ScrollView } from 'react-native'

import { Content } from '@/components/layout/content'
import { Screen } from '@/components/layout/screen'
import { TextField } from '@/components/form/text-field'
import { useDisplayName } from '@/hooks/use-display-name'

import { AccountSection } from '../components/account-section'

export function Settings() {
  const [displayName, setDisplayName] = useDisplayName()
  return (
    <Screen>
      <ScrollView
        contentContainerClassName='items-center p-4'
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps='handled'
      >
        <Content className='gap-6'>
          <AccountSection />
          <TextField
            label='表示名'
            testID='display-name'
            value={displayName}
            onChangeText={setDisplayName}
          />
        </Content>
      </ScrollView>
    </Screen>
  )
}
