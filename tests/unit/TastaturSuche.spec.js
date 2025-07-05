import { mount } from '@vue/test-utils'
import TastaturSuche from '@/components/TastaturSuche.vue'
import { describe, it, expect } from 'vitest'

describe('TastaturSuche.vue', () => {
    it('zeigt Ladeanzeige beim Laden', () => {
        const wrapper = mount(TastaturSuche, {
            data() {
                return {
                    loading: true,
                    tastaturen: [],
                    searchQuery: ''
                }
            }
        })
        expect(wrapper.text()).toContain('Lade...')
    })

    it('zeigt keine Ergebnisse an, wenn tastaturen leer sind', () => {
        const wrapper = mount(TastaturSuche, {
            data() {
                return {
                    loading: false,
                    tastaturen: [],
                    searchQuery: 'abc'
                }
            }
        })
        expect(wrapper.text()).toContain('Keine Ergebnisse gefunden.')
    })

    it('zeigt Ergebnisse an, wenn tastaturen vorhanden sind', () => {
        const tastaturenMock = [
            { id: 1, tastaturName: 'Test1', beschreibung: 'Beschreibung1' },
            { id: 2, tastaturName: 'Test2', beschreibung: 'Beschreibung2' }
        ]
        const wrapper = mount(TastaturSuche, {
            data() {
                return {
                    loading: false,
                    tastaturen: tastaturenMock,
                    searchQuery: 'Test'
                }
            }
        })
        expect(wrapper.findAll('.card').length).toBe(2)
    })
})
