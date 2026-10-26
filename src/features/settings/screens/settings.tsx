import { ScrollView } from 'react-native'

import { TextField } from '@/components/form/text-field'
import { useDisplayName } from '@/hooks/use-display-name'

export function Settings() {
  const [displayName, setDisplayName] = useDisplayName()
  return (
    <ScrollView contentContainerClassName='p-4'>
      <TextField
        label='表示名'
        testID='display-name'
        value={displayName}
        onChangeText={setDisplayName}
      />
    </ScrollView>
  )
}
